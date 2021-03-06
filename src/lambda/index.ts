import * as dotenv from 'dotenv';

import { ConfigParameterNotDefinedError } from '../common/error/ConfigParameterNotDefinedError';
import { Main } from '../main/Main';
import { PostgresService } from '../database/Postgres.service';
import { TelegramService } from '../telegram/Telegram.service';
import { MessageService } from '../message/Message.service';
import { IEvent } from './model/IEvent.interface';

dotenv.config();

exports.handler = async ({ body, queryStringParameters: { token } }: IEvent, context: never) => {
  console.log('New request');

  if (process.env.TELEGRAM_TOKEN === undefined) {
    throw new ConfigParameterNotDefinedError('TELEGRAM_TOKEN');
  }
  if (process.env.DATABASE_URL === undefined) {
    throw new ConfigParameterNotDefinedError('DATABASE_URL');
  }
  if (process.env.APP_TOKEN === undefined) {
    throw new ConfigParameterNotDefinedError('APP_TOKEN');
  }

  if (token !== process.env.APP_TOKEN) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        result: 'wrong token',
      }),
    };
  }

  const postgresService = new PostgresService(process.env.DATABASE_URL);

  const configuration = {
    publicUrl: process.env.PUBLIC_URL,
  };

  const main = new Main(
    configuration,
    postgresService,
    new TelegramService(process.env.TELEGRAM_TOKEN),
    new MessageService(),
  );

  try {
    await main.processMessage(body);
  } catch (error) {
    console.error('Unexpected error occurred: ', error.message);
  }

  try {
    await postgresService.closeConnection();
  } catch (error) {
    console.error('Error closing database connection: ', error.message);
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      result: 'success',
    }),
  };
};
