import 'reflect-metadata';
import { server } from './server/Server';
import { AppDataSource1, AppDataSource2 } from './server/database';
import { dailyDatabaseMigration } from './server/shared/services';

Promise.all([
    AppDataSource1.initialize(),
    AppDataSource2.initialize()
]).then(async () => {

    console.log('\nBanco de dados conectado\n');

    await dailyDatabaseMigration();

    server.listen(process.env.PORT, async () => {
        console.log(`Servidor rodando no endereço: http://${process.env.HOST}:${process.env.PORT}\n`);
    });

}).catch(error => {
    console.error('Erro ao conectar ao banco de dados:', error);
});

