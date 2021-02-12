import { register } from './swManager';
import Clock from './Clock';
import './index.css';

register();

const clock = new Clock();
clock.draw(document.querySelector('.clock'));
