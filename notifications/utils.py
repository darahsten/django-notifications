'''' Django notifications utils file '''
# -*- coding: utf-8 -*-
import sys
from django.utils import timezone
from dateutil.relativedelta import relativedelta


if sys.version > '3':
    long = int  # pylint: disable=invalid-name


def slug2id(slug):
    return long(slug) - 110909


def id2slug(notification_id):
    return notification_id + 110909


def time_elapsed(timestamp):
    """
    The time since this notification was triggered.
    Returned as x minutes ago, x hours ago, x days ago.
    """
    now = timezone.now()
    time_diff = relativedelta(now, timestamp)
    if time_diff.months > 0:
        return '{} months ago'.format(time_diff.months)
    if time_diff.days > 0:
        return '{} days ago'.format(time_diff.days)
    if time_diff.hours > 0:
        return '{} hours ago'.format(time_diff.hours)
    if time_diff.minutes > 0:
        return '{} minutes ago'.format(time_diff.minutes)
    return 'now'
