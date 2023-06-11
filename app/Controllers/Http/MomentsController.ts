import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import { v4 as uuidv4 } from 'uuid'
import Application from '@ioc:Adonis/Core/Application'

export default class MomentsController {
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()
    const image = request.file('image', this.validationOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    try {
      const moment = await Moment.create(body)
      response.status(200).json(moment)
    } catch (error) {
      response.status(400).send(error)
    }
  }

  public async index({ response }: HttpContextContract) {
    const moments = await Moment.query().preload('comments')
    response.json(moments)
  }

  public async show({ params, response }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    await moment.load('comments')
    response.json(moment)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    await moment.delete()
    response.send('Moment Deleted')
  }

  public async update({ params, request, response }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    const body = request.body()

    moment.title = body.title
    moment.description = body.description

    if (!moment.image != body.image || !moment.image) {
      const image = request.file('image', this.validationOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`
        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        moment.image = imageName
      }
    }
    await moment.save()
    return response.json(moment)
  }
}
