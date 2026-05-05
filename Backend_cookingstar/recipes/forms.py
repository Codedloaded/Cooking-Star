from django import forms
from .models import Recipe

class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = ['title', 'description', 'ingredients', 'instructions', 'image']

    # 🔹 Validate single field (title)
    def clean_title(self):
        title = self.cleaned_data.get('title')

        if not title:
            raise forms.ValidationError("Title is required")

        if len(title) < 3:
            raise forms.ValidationError("Title must be at least 3 characters")

        return title

    # 🔹 Validate another field (ingredients)
    def clean_ingredients(self):
        ingredients = self.cleaned_data.get('ingredients')

        if not ingredients:
            raise forms.ValidationError("Ingredients cannot be empty")

        return ingredients


    def clean(self):
        cleaned_data = super().clean()
        description = cleaned_data.get('description')
        instructions = cleaned_data.get('instructions')

        if not description:
            raise forms.ValidationError("Description is required")

        if not instructions:
            raise forms.ValidationError("Instructions are required")

        return cleaned_data