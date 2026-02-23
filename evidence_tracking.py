"""
Evidence Chat Event Tracking Module

This module provides functions to track evidence_chat_completed events
with the is_managed property for both Amplitude and PostHog analytics.

The is_managed property captures whether the user/team was managed at the
time of the chat completion, enabling accurate debugging and analytics
without needing to join tables or worry about is_managed status changes over time.
"""

from typing import Optional, Any, TYPE_CHECKING

try:
    import posthog
except ImportError:
    posthog = None

try:
    from amplitude import Amplitude, BaseEvent
except ImportError:
    Amplitude = None
    BaseEvent = None

if TYPE_CHECKING:
    from amplitude import Amplitude


def track_evidence_chat_completed(
    user_id: str,
    chat_id: str,
    is_managed: bool,
    team_id: Optional[str] = None,
    additional_properties: Optional[dict[str, Any]] = None,
    amplitude_client: Optional["Amplitude"] = None,
    posthog_api_key: Optional[str] = None,
) -> None:
    """
    Track the evidence_chat_completed event to both Amplitude and PostHog.
    
    Args:
        user_id: The unique identifier for the user
        chat_id: The unique identifier for the evidence chat
        is_managed: Whether the user/team is managed at the time of chat completion
        team_id: Optional team identifier
        additional_properties: Optional dict of additional event properties
        amplitude_client: Optional Amplitude client instance
        posthog_api_key: Optional PostHog API key (uses default if not provided)
    """
    event_name = "evidence_chat_completed"
    
    properties = {
        "chat_id": chat_id,
        "is_managed": is_managed,
    }
    
    if team_id:
        properties["team_id"] = team_id
    
    if additional_properties:
        properties.update(additional_properties)
    
    _track_to_posthog(
        user_id=user_id,
        event_name=event_name,
        properties=properties,
        api_key=posthog_api_key,
    )
    
    _track_to_amplitude(
        user_id=user_id,
        event_name=event_name,
        properties=properties,
        client=amplitude_client,
    )


def _track_to_posthog(
    user_id: str,
    event_name: str,
    properties: dict[str, Any],
    api_key: Optional[str] = None,
) -> None:
    """
    Send event to PostHog analytics.
    
    Args:
        user_id: The unique identifier for the user
        event_name: The name of the event to track
        properties: Event properties including is_managed
        api_key: Optional PostHog API key
    """
    if posthog is None:
        return
    
    if api_key:
        posthog.project_api_key = api_key
    
    posthog.capture(
        distinct_id=user_id,
        event=event_name,
        properties=properties,
    )


def _track_to_amplitude(
    user_id: str,
    event_name: str,
    properties: dict[str, Any],
    client: Optional["Amplitude"] = None,
) -> None:
    """
    Send event to Amplitude analytics.
    
    Args:
        user_id: The unique identifier for the user
        event_name: The name of the event to track
        properties: Event properties including is_managed
        client: Optional Amplitude client instance
    """
    if client is None or BaseEvent is None:
        return
    
    event = BaseEvent(
        event_type=event_name,
        user_id=user_id,
        event_properties=properties,
    )
    
    client.track(event)


def get_is_managed_for_user(user: Any, team: Any) -> bool:
    """
    Determine if a user should be considered 'managed' for tracking purposes.
    
    This checks both user-level and team-level is_managed flags.
    A user is considered managed if either:
    - The user's is_managed flag is True, OR
    - The user's team has is_managed = True
    
    Args:
        user: User object with is_managed attribute
        team: Team object with is_managed attribute
        
    Returns:
        bool: True if the user is managed, False otherwise
    """
    user_is_managed = getattr(user, "is_managed", False)
    team_is_managed = getattr(team, "is_managed", False) if team else False
    
    return user_is_managed or team_is_managed
