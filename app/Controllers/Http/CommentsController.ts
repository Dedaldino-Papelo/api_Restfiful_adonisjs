import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import Comment from 'App/Models/Comment'

export default class CommentsController {
    public async store({params, request, response}:HttpContextContract){
        const body = request.body()
        const moment_id = params.momentId

        try {
            const moment = await Moment.findOrFail(moment_id)
            if(moment){
                body.momentId = moment.id
                const comment = await Comment.create(body)
                response.status(200).json(comment)

            } else {
                response.status(400).send("Moments not found")
            }
        } catch (error) {
            response.status(500).json(error)
        }

    }
}
