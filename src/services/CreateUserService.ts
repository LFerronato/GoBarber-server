import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '../errors/AppError'

import User from '../models/User'

interface Request {
  name: string
  email: string
  password: string
}

class CreateUserService {
  public async run({ name, email, password }: Request): Promise<User> {
    console.log('1');
    const usersRepository = getRepository(User)
    console.log('2');

    const checkUserExists = await usersRepository.findOne({
      where: { email }
    })

    if (checkUserExists) {
      throw new AppError('Email address already used.')
    }
    const hashedPassword = await hash(password, 8)
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword
    })
    await usersRepository.save(user)
    return user
  }
}

export default CreateUserService
