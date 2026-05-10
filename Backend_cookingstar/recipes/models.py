from django.db import models
from django.conf import settings


class Recipe(models.Model):
    DIFFICULTY_CHOICES = [(1, 'Easy'), (2, 'Medium'), (3, 'Hard')]

    # FIX: author field was missing — needed to know who owns a recipe
    author       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='recipes'
    )
    title        = models.CharField(max_length=200)
    description  = models.TextField(blank=True)
    ingredients  = models.TextField()
    instructions = models.TextField()

    # FIX: course and difficulty were stored only in localStorage before
    course       = models.CharField(max_length=100, blank=True)
    difficulty   = models.IntegerField(choices=DIFFICULTY_CHOICES, default=2)
    time_minutes = models.PositiveIntegerField(default=0)

    image        = models.ImageField(upload_to='recipes/', null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
