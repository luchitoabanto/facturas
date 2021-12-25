const sgMail = require('@sendgrid/mail')
const { Pool } = require('pg');
const pool = new Pool({
    host: 'ec2-3-208-157-78.compute-1.amazonaws.com',
    user: 'ajeuwikenhshrf',
    password: '0ba066351cd30338be16aa410a26cc3deb6459a9792c1bfede5a47f71624bd3e',
    database: 'd36do3ba44vjh8',
    port: '5432',
    ssl: {
        rejectUnauthorized: false
    },
})






const postAgregar = async (req, res) => {
    const { nombres, ap_paterno, ap_materno, correo, monto,cuotas, dni, fnacimiento } = req.body;
    const response = await pool.query('INSERT INTO CLIENTES(nombres,ap_paterno,ap_materno,correo,dni,fnacimiento) VALUES ($1,$2,$3,$4,$5,$6) returning cod_cliente', [nombres, ap_paterno, ap_materno, correo, dni, fnacimiento]);

    const { cod_cliente } = response.rows[0];
    const fecha = new Date();
    await pool.query('insert into solicitudes(cod_cliente,monto,cuotas,estado,fecha) values ($1,$2,$3,$4,$5)', [cod_cliente, monto,cuotas, 'En Proceso', fecha]);

    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: correo,
        from: 'bancob381@gmail.com',
        subject: `Estado de Solicitud - Cliente (${nombres} ${ap_paterno} ${ap_materno})`,
        text: `Su solicitud de ${monto} soles, para pagar en ${cuotas} cuotas ha sido enviada. Por favor descargue nuestra app móvil`,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
            res.status(200).json({ message: 'Email sent' });
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json({ message: 'Error sending email', res: error });
        });

}

const mensaje = (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const {correo,sujeto,texto} = req.body
    const msg = {
        to: correo, // correo a quien se manda el mensaje
        from: 'empresafacturas3@gmail.com',// correo de la cuenta del api key
        subject: sujeto,
        text: texto,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
            res.status(200).json({ message: 'Email sent' });
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json({ message: 'Error sending email', res: error });
        });
}

module.exports = {
    postAgregar,
    mensaje,
};