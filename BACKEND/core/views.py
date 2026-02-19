import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, filters
from django.db.models import Count
from django.db.models.functions import TruncDate
from .models import Ticket
from .serializers import TicketSerializer
from django_filters.rest_framework import DjangoFilterBackend

from openai import OpenAI


class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']

class TicketUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    lookup_field = 'id'

class TicketStatsView(APIView):
    def get(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='open').count()
        
        daily_counts = Ticket.objects.annotate(date=TruncDate('created_at')).values('date').annotate(count=Count('id'))
        if daily_counts:
            avg_per_day = sum(d['count'] for d in daily_counts) / len(daily_counts)
        else:
            avg_per_day = 0

        priority_breakdown = Ticket.objects.values('priority').annotate(count=Count('id'))
        category_breakdown = Ticket.objects.values('category').annotate(count=Count('id'))

        priority_dict = {p['priority']: p['count'] for p in priority_breakdown}
        category_dict = {c['category']: c['count'] for c in category_breakdown}

        for choice, _ in Ticket.PRIORITY_CHOICES:
            priority_dict.setdefault(choice, 0)
        for choice, _ in Ticket.CATEGORY_CHOICES:
            category_dict.setdefault(choice, 0)

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_per_day, 1),
            "priority_breakdown": priority_dict,
            "category_breakdown": category_dict
        })

class TicketClassifyView(APIView):
    def post(self, request):
        data = request.data
        
        # Ensure data is a dictionary to prevent AttributeError
        if not isinstance(data, dict):
            return Response(
                {"error": "Invalid request format. Expected a JSON object with a 'description' field."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        description = data.get('description')
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Requirements and Constraints
        ALLOWED_CATEGORIES = ["billing", "technical", "account", "general"]
        ALLOWED_PRIORITIES = ["low", "medium", "high"]
        DEFAULT_RESPONSE = {"category": "general", "priority": "low"}
        
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return Response(DEFAULT_RESPONSE)

        system_prompt = f"""
        You are a support ticket classification AI. 
        Classify the user's problem into exactly one category and one priority.
        
        ALLOWED CATEGORIES: {ALLOWED_CATEGORIES}
        ALLOWED PRIORITIES: {ALLOWED_PRIORITIES}

        STRICT RULES:
        - Return ONLY valid JSON: {{"category": "...", "priority": "..."}}
        - No markdown formatting.
        - No explanations.
        - Default to 'general'/'low' if uncertain.
        """.strip()

        try:
            # Initialize client per-request to pick up environment variables correctly
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=api_key,
            )
            
            # Using OpenAI SDK pointing to OpenRouter
            completion = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": description}
                ],
                temperature=0.2,
            )
            
            content = completion.choices[0].message.content.strip()
            
            # Simple cleanup in case of markdown or extra whitespace
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.strip("`").strip()
            
            classification = json.loads(content)
            
            category = classification.get("category", "general").lower()
            if category not in ALLOWED_CATEGORIES:
                category = "general"
                
            priority = classification.get("priority", "low").lower()
            if priority not in ALLOWED_PRIORITIES:
                priority = "low"

            return Response({
                "category": category,
                "priority": priority
            })

        except Exception:
            # Return safe fallback if AI call fails (e.g. invalid API key)
            return Response(DEFAULT_RESPONSE)
