const Sib = require('sib-api-v3-sdk');
const ForgotPasswordRequests = require('../model/forgotpasswordrequests');
const User = require('../model/user')
require('dotenv').config()

const bcrypt = require('bcrypt')





exports.forgotPassword = async (req, res, next) => {
    console.log(req.body)
    console.log(req.body.email)

    try {
        //finding user with reset email and then its id to create reset table , 
        //  once created then fetched its uuid with user id , then pass in email body
        const user = await User.findOne({ where: { userEmail: req.body.email } })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user)

        const forgotpasswordrequest = await ForgotPasswordRequests.create({
            userId: user.id
        })
        console.log(forgotpasswordrequest)
        const resetRequest = await ForgotPasswordRequests.findOne({ where: { userId: user.id } })

        console.log("This is the request id", resetRequest.id)



        //sending mail 
        if (!process.env.API_KEY) {
            throw new Error('API_KEY is not set in environment variables');
        }

        const client = Sib.ApiClient.instance
        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.API_KEY

        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const sender = {
            email: 'puransinghrana080@gmail.com',
            name: 'puran'
        }
        const receivers = [{ email: req.body.email }]


        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Link for the reset',
            textContent: `http://localhost:3000/password/resetpassword/${resetRequest.id} "click here for reset"`
        })

        console.log("Email sent successfully:", response);
        res.status(200).json({ message: "Reset email sent successfully" });

    } catch (error) {
        console.error('Error in sending email:', error);
        res.status(500).json({ message: 'Failed to send reset email', error });
    }


}

exports.resetPasswordRequest = async (req, res, next) => {
    try {
        const uuid = req.params.uuid
        console.log(">>>>>>..", uuid)
        const resetRequest = await ForgotPasswordRequests.findOne({ where: { id: uuid, isactive: true } })

        if (resetRequest) {
            console.log("password rest Form")
            res.redirect(`/update_password.html?uuid=${uuid}`)
        }
        else {

            res.status(400).json({ message: "Invalid or expired password reset request" })
        }

    }
    catch (error) {
        console.log("Link not working ", error)
        res.status(500).json({ message: "Server error" });
    }
}


exports.updatePassword = async (req, res, next) => {
    try {

        const { uuid, newPassword } = req.body

        const resetRequest = await ForgotPasswordRequests.findOne({ where: { id: uuid, isactive: true } })

        if (!resetRequest) {
            return res.status(400).json({ message: "Invalid or expired reset request" });
        }

        const user = await User.findOne({ where: { id: resetRequest.userId } })

        const saltRounds = 10;

        const hash =await bcrypt.hash(newPassword, saltRounds)
            // if (err) {
            //     console.log("err", err)
            // }
            await user.update({ password: hash })

            await ForgotPasswordRequests.update({ isactive: false }, { where: { id: uuid } })

            res.status(200).json({ message: "Password Updated successfully" })
        

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "update server error" })
    }

}