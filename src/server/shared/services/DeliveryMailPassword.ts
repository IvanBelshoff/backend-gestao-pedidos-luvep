import nodemailer from 'nodemailer';

export const deliveryMailPassword = async (email: string, senha: string): Promise<void | Error> => {

    const port = process.env.EXCHANGE_PORT as unknown as number;

    const transporter = nodemailer.createTransport({
        host: process.env.EXCHANGE_HOST,
        port: port,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {

        transporter.verify((error, success) => {
            if (error) {
                return new Error('Erro interno do servidor');
            } else if (success) {

                transporter.sendMail({
                    from: process.env.MAIL_USERNAME,
                    to: email,
                    subject: 'Recuperação de Senha',
                    html:
                        `
                                <!DOCTYPE html>
            
                                <html lang="pt-br">
            
                                <head>
                                    <meta charset="UTF-8">
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Recuperação de Senha</title>
                                    <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            margin: 0;
                                            padding: 0;
                                        }
            
                                        .image-container {
                                            max-width: 469px;
                                            height: 303px;
                                            background-color: #FFF;
                                            border-bottom: 2px solid #002B5B;
                                        }
            
                                        .container {
                                            max-width: 469px;
                                            margin: 0 auto;
                                            margin: 20px;
                                            background-color: #fff;
                                            border-radius: 15px;
                                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                                            margin-top: 50px;
                                            text-align: center;
                                            color: #000;
                                            border: 2px solid #002B5B;
                                            padding-bottom: 20px;
                                        }
            
                                        h2 {
                                            margin-bottom: 20px;
                                        }
            
                                        p {
                                            margin-bottom: 20px;
                                        }
            
                                        .link {
                                            display: inline-block;
                                            color: #182871;
                                            font-size: 17px;
                                            text-decoration: none;
                                            border-radius: 50px;
                                            border: none;
                                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                                            transition: background-color 0.3s ease;
                                            background-color: none;
                                            font-weight: bold;
                                        }
                                    </style>
                                </head>
            
                                <body>
            
                                    <div class="container">
                                        <div class="image-container">
                                            <img src="${`http://${process.env.HOST}:${process.env.PORT}/profile/logo.png`}" style="max-width: auto; height: 270px; margin-top: 8px">
                                        </div>
                                        <h2>Recuperação de Senha</h2>
                                        <p>Sua nova senha é: <strong>${senha}</strong></p>
                                        <p>Recomendamos que você altere sua senha assim que possível.</p>
                                        <p>Se você não solicitou essa recuperação de senha, entre em contato conosco imediatamente.</p>
                                        <p>
                                            Atenciosamente.<br>
                                        </p>
                                        <p>
                                            <a href="${process.env.URL}" class="link">Acessar o Sistema</a>
                                        </p>
                                    </div>
            
                                </body>
            
                                </html>  
                            `

                });

                return;
            }
        });

    } catch (error) {
        console.log(error);
        return new Error('Erro ao enviar o e-mail');
    }
};
