import nodemailer from 'nodemailer';

export const DeliveryMailPassword = async (email: string, senha: string): Promise<void | Error> => {

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
                    html: `
                        <!DOCTYPE html>
            <html lang="pt-br" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
            
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <meta name="x-apple-disable-message-reformatting">
              <title>Luvep</title>
              <style>
                table,
                td,
                div,
                h1,
                p {
                  font-family: Arial, sans-serif;
                }
            
                #conteudo {
                  -webkit-box-shadow: 0px 0px 36px 10px rgba(0, 0, 0, 0.19);
                  box-shadow: 0px 0px 36px 10px rgba(0, 0, 0, 0.19);
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

                @media screen and (max-width: 830px) {
                  .unsub {
                    display: block;
                    padding: 8px;
                    margin-top: 14px;
                    border-radius: 6px;
                    background-color: #E6E8EB;
                    text-decoration: none !important;
                    font-weight: bold;
                  }
            
                  .col-lge {
                    max-width: 100% !important;
                  }
                }
            
                @media screen and (min-width: 830px) {
                  .col-sml {
                    max-width: 27% !important;
                  }
            
                  .col-lge {
                    max-width: 73% !important;
                  }
                }
              </style>
            </head>
            
            <body style="margin:0;padding:0;word-spacing:normal;background-color:#FFF;">
              <div role="article" aria-roledescription="email" lang="pt-br"
                style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#FFF;">
                <table role="presentation" style="width:100%;border:none;border-spacing:0;">
                  <tr>
                    <td align="center" style="padding:0;">
                      <!--[if mso]>
                      <table role="presentation" align="center" style="width:600px;">
                      <tr>
                      <td>
                      <![endif]-->
                      <table role="presentation"
                        style="width:95%;max-width:1000px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;line-height:22px;color:#363636;">
                        <tr>
                          <td style="text-align:center;">
                            <a href="${process.env.URL}" style="text-decoration:none;"><img
                                src="${`http://${process.env.HOST}:${process.env.PORT}/profile/logo.png`}" width="350" alt="Logo"
                                style="width: 350px;max-width:85%;height:auto;border:none;text-decoration:none;color:#FFF;"></a>
                          </td>
                        </tr>
                        <tr id="conteudo">
                          <td style="padding:30px;background-color:#ffffff;text-align:center;">              
                          <p>Sua nova senha é: <strong>${senha}</strong></p>                                          
                          <p>Recomendamos que você altere sua senha assim que possível.</p>  
                          <p>Se você não solicitou essa recuperação de senha, entre em contato conosco imediatamente.</p>  
                          <p>
                            <a href="${process.env.URL}" class="link">Acessar o Sistema</a>
                           </p>
                         </td>
                        </tr>
                  </tr>
                  <tr>
                    <td style="padding:5px;text-align:center;justify-content: center;align-items: center;background-color:#202A44;">
                      <img src="${`http://${process.env.HOST}:${process.env.PORT}/profile/luvep.png`}" width="150" height="auto" alt="Luvep">
                    </td>
                  </tr>
                    </table>
                    </td>
                    </tr>
                </table>
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
