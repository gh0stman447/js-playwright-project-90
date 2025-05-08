import { UserForm, UserLogin } from '../types';

export const authUserData: UserLogin = {
  username: 'admin',
  password: 'admin',
};

export const newUserData: UserForm = {
  email: 'user@bk.ru',
  firstName: 'User',
  lastName: 'Userovich',
};

export const otherUserData: UserForm = {
  email: 'user2@bk.ru',
  firstName: 'User2',
  lastName: 'Userovich2',
};

export const notCorrectUserData: UserForm = {
  email: 'user',
  firstName: 'User',
  lastName: 'Userovich',
};
