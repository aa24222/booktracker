from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
import pandas as pd
import requests

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    @action(detail=False, methods=['post'])
    def import_csv(self, request):
        file = request.FILES['file']
        df = pd.read_csv(file)
        imported_count = 0
        for _, row in df.iterrows():
            book, created = Book.objects.get_or_create(
                title=row.get('Title', ''),
                author=row.get('Author', ''),
                cover_url=row.get('Cover Url', '')
            )
            if created:
                imported_count += 1
        return Response({"message": f"Imported {imported_count} new books"})

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        url = f"https://www.googleapis.com/books/v1/volumes?q={query}"
        r = requests.get(url).json()
        results = []
        for item in r.get('items', []):
            info = item.get('volumeInfo', {})
            results.append({
                "title": info.get('title'),
                "author": ", ".join(info.get('authors', [])),
                "cover_url": info.get('imageLinks', {}).get('thumbnail', '')
            })
        return Response(results)
