from rest_framework import serializers
from feedback.models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    user_Fulname = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Feedback
        fields = '__all__'
    def get_user_Fulname(self, obj):
        return f'{obj.user.get_full_name}'