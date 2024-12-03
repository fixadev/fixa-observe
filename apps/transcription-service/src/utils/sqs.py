import boto3
from os import getenv

sqs = boto3.client(
    'sqs',
    region_name='us-east-1',
    aws_access_key_id=getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=getenv('AWS_SECRET_ACCESS_KEY')
)
