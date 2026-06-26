from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"
        read_only_fields = ["id", "date_added"]


class ISBNLookupSerializer(serializers.Serializer):
    isbn = serializers.CharField(max_length=13, min_length=10)
