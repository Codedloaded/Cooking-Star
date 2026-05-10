from rest_framework import serializers
from .models import Recipe
import json


class RecipeSerializer(serializers.ModelSerializer):
    # Return the full absolute URL for the image so the frontend can use it directly
    image_url = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    # Parse the stored ingredients text into a list for the frontend
    ingredients_list = serializers.SerializerMethodField()

    class Meta:
        model  = Recipe
        fields = [
            'id', 'title', 'description', 'ingredients', 'ingredients_list',
            'instructions', 'course', 'difficulty', 'time_minutes',
            'image', 'image_url',
            'author', 'author_name',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at',
                            'image_url', 'author_name', 'ingredients_list']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_author_name(self, obj):
        if obj.author:
            return obj.author.username
        return None

    def get_ingredients_list(self, obj):
        """
        The ingredients field is stored as plain text (one per line or JSON).
        Return a list of dicts with a 'name' key so the JS can search by ingredient.
        """
        if not obj.ingredients:
            return []
        raw = obj.ingredients.strip()
        # Try JSON array first (e.g. [{"name":"flour"}, ...] or ["flour", ...])
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                result = []
                for item in parsed:
                    if isinstance(item, dict):
                        result.append(item)
                    else:
                        result.append({'name': str(item)})
                return result
        except (json.JSONDecodeError, ValueError):
            pass
        # Fall back: one ingredient per line
        return [{'name': line.strip()} for line in raw.splitlines() if line.strip()]
