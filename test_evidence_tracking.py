"""
Tests for evidence_tracking module.
"""

import unittest
from unittest.mock import MagicMock, patch

from evidence_tracking import (
    get_is_managed_for_user,
    track_evidence_chat_completed,
)


class TestGetIsManagedForUser(unittest.TestCase):
    """Tests for get_is_managed_for_user function."""
    
    def test_user_is_managed_true(self):
        """User with is_managed=True should return True."""
        user = MagicMock()
        user.is_managed = True
        team = MagicMock()
        team.is_managed = False
        
        result = get_is_managed_for_user(user, team)
        
        self.assertTrue(result)
    
    def test_team_is_managed_true(self):
        """Team with is_managed=True should return True."""
        user = MagicMock()
        user.is_managed = False
        team = MagicMock()
        team.is_managed = True
        
        result = get_is_managed_for_user(user, team)
        
        self.assertTrue(result)
    
    def test_both_managed_false(self):
        """Both user and team not managed should return False."""
        user = MagicMock()
        user.is_managed = False
        team = MagicMock()
        team.is_managed = False
        
        result = get_is_managed_for_user(user, team)
        
        self.assertFalse(result)
    
    def test_no_team(self):
        """User without team should only check user is_managed."""
        user = MagicMock()
        user.is_managed = False
        
        result = get_is_managed_for_user(user, None)
        
        self.assertFalse(result)
    
    def test_user_managed_no_team(self):
        """Managed user without team should return True."""
        user = MagicMock()
        user.is_managed = True
        
        result = get_is_managed_for_user(user, None)
        
        self.assertTrue(result)


class TestTrackEvidenceChatCompleted(unittest.TestCase):
    """Tests for track_evidence_chat_completed function."""
    
    @patch("evidence_tracking._track_to_posthog")
    @patch("evidence_tracking._track_to_amplitude")
    def test_tracks_with_is_managed_true(self, mock_amplitude, mock_posthog):
        """Event should include is_managed=True when user is managed."""
        track_evidence_chat_completed(
            user_id="kp_123",
            chat_id="chat_456",
            is_managed=True,
            team_id="team_789",
        )
        
        mock_posthog.assert_called_once()
        call_kwargs = mock_posthog.call_args[1]
        self.assertEqual(call_kwargs["properties"]["is_managed"], True)
        self.assertEqual(call_kwargs["properties"]["chat_id"], "chat_456")
        self.assertEqual(call_kwargs["properties"]["team_id"], "team_789")
    
    @patch("evidence_tracking._track_to_posthog")
    @patch("evidence_tracking._track_to_amplitude")
    def test_tracks_with_is_managed_false(self, mock_amplitude, mock_posthog):
        """Event should include is_managed=False when user is not managed."""
        track_evidence_chat_completed(
            user_id="kp_123",
            chat_id="chat_456",
            is_managed=False,
        )
        
        mock_posthog.assert_called_once()
        call_kwargs = mock_posthog.call_args[1]
        self.assertEqual(call_kwargs["properties"]["is_managed"], False)
    
    @patch("evidence_tracking._track_to_posthog")
    @patch("evidence_tracking._track_to_amplitude")
    def test_event_name_is_correct(self, mock_amplitude, mock_posthog):
        """Event name should be evidence_chat_completed."""
        track_evidence_chat_completed(
            user_id="kp_123",
            chat_id="chat_456",
            is_managed=True,
        )
        
        call_kwargs = mock_posthog.call_args[1]
        self.assertEqual(call_kwargs["event_name"], "evidence_chat_completed")
    
    @patch("evidence_tracking._track_to_posthog")
    @patch("evidence_tracking._track_to_amplitude")
    def test_additional_properties_merged(self, mock_amplitude, mock_posthog):
        """Additional properties should be included in event."""
        track_evidence_chat_completed(
            user_id="kp_123",
            chat_id="chat_456",
            is_managed=True,
            additional_properties={"source": "web", "evidence_count": 5},
        )
        
        call_kwargs = mock_posthog.call_args[1]
        self.assertEqual(call_kwargs["properties"]["source"], "web")
        self.assertEqual(call_kwargs["properties"]["evidence_count"], 5)


if __name__ == "__main__":
    unittest.main()
