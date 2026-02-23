"""
Example Integration: Adding is_managed to evidence_chat_completed

This file demonstrates how to integrate the is_managed property tracking
into the existing chat completion flow. Based on the discussion, this would
be integrated into chat_manager.py where evidence chats are processed.

The key change: capture is_managed at the time of event emission, not as
a user property that could change over time.
"""

from evidence_tracking import track_evidence_chat_completed, get_is_managed_for_user


class ChatManagerExample:
    """
    Example showing where to add is_managed tracking in the chat completion flow.
    
    This would be integrated into the existing ChatManager class in chat_manager.py.
    """
    
    def __init__(self, amplitude_client=None, posthog_api_key=None):
        self.amplitude_client = amplitude_client
        self.posthog_api_key = posthog_api_key
    
    def complete_evidence_chat(self, user, team, chat_id: str, chat_result: dict) -> dict:
        """
        Complete an evidence chat and track the event with is_managed.
        
        This is where the evidence_chat_completed event should be emitted,
        capturing the is_managed status at the exact moment of completion.
        
        Args:
            user: The user completing the chat
            team: The user's team (may be None)
            chat_id: Unique identifier for the chat
            chat_result: The result/response from the evidence chat
            
        Returns:
            dict: The chat result
        """
        is_managed = get_is_managed_for_user(user, team)
        
        track_evidence_chat_completed(
            user_id=user.id,
            chat_id=chat_id,
            is_managed=is_managed,
            team_id=team.id if team else None,
            additional_properties={
                "source": chat_result.get("source"),
                "evidence_count": chat_result.get("evidence_count", 0),
            },
            amplitude_client=self.amplitude_client,
            posthog_api_key=self.posthog_api_key,
        )
        
        return chat_result


# Example event payload that will be sent to both Amplitude and PostHog:
#
# {
#     "event": "evidence_chat_completed",
#     "distinct_id": "kp_46ce1671140c4e2b8401c6c041bc3677",
#     "properties": {
#         "chat_id": "699bf8682a23148e7a663221",
#         "is_managed": true,  # <-- NEW PROPERTY
#         "team_id": "team_abc123",
#         "source": "web",
#         "evidence_count": 5
#     }
# }
#
# This allows analytics queries to filter by is_managed at the time of
# the event, rather than joining with current user properties which may
# have changed since the event occurred.
