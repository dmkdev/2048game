import { GameEvents } from '../types';
import EventBus from '@/core/EventBus';

const eventBus = new EventBus<GameEvents>();

export default eventBus;
