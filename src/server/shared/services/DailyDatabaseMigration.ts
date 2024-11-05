import cron from 'node-cron';
import { Pedido } from '../../database/entities';
import { pedidoRepository, PedidoVolvo } from '../../database/repositories';

// Função para atualizar um campo se o valor for diferente
const updateIfDifferent = <T>(existingValue: T, newValue: T): T => {
    return existingValue !== newValue ? newValue : existingValue;
};

// Migração de criação de registros
const migrationCreateRegisters = async (): Promise<string | Error> => {

    try {

        // Obtem todos os registros do repositório Volvo
        const pedidosVolvo = await PedidoVolvo.find();

        // Obtem todos os registros existentes do repositório Luvep de uma só vez
        const existingRecords = await pedidoRepository.find();

        const existingMap = new Map(existingRecords.map(record => [record.id_volvo, record]));

        const recordsToCreate: Pedido[] = [];

        // Itera sobre os registros para inserir no repositório Luvep se não existirem
        for (const pedidoVolvoRecord of pedidosVolvo) {

            if (!existingMap.has(pedidoVolvoRecord.ID)) {

                const newRecord = pedidoRepository.create({
                    id_volvo: pedidoVolvoRecord.ID,
                    filial: pedidoVolvoRecord.FILIAL,
                    tipo: pedidoVolvoRecord.TIPO,
                    pedido: pedidoVolvoRecord.PEDIDO,
                    cod_cliente: pedidoVolvoRecord.COD_CLIENTE,
                    cliente: pedidoVolvoRecord.CLIENTE,
                    data_do_pedido: new Date(pedidoVolvoRecord.DATA_DO_PEDIDO),
                    vendedor: pedidoVolvoRecord.VENDEDOR,
                    chassi: pedidoVolvoRecord.CHASSI,
                    departamento: pedidoVolvoRecord.DEPARTAMENTO,
                    total: pedidoVolvoRecord.TOTAL,
                    dias_em_aberto: pedidoVolvoRecord.DIAS_EM_ABERTO,
                    tipo_de_operacao: pedidoVolvoRecord.TIPO_DE_OPERACAO
                });

                recordsToCreate.push(newRecord);

            }
        }

        // Salva os novos registros em uma operação em massa
        if (recordsToCreate.length) {

            await pedidoRepository.save(recordsToCreate);

        }

        return `Registros criados com sucesso: ${recordsToCreate.length}`;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao migrar os registros');
    }
};

// Migração de atualização de registros
const migrationUpdateRegisters = async (): Promise<string | Error> => {

    try {

        // Obtem todos os registros do repositório Volvo
        const orderBookVolvo = await PedidoVolvo.find();

        // Obtem todos os registros existentes do repositório Luvep de uma só vez
        const existingRecords = await pedidoRepository.find();

        const existingMap = new Map(existingRecords.map(record => [record.id_volvo, record]));

        const recordsToUpdate: Pedido[] = [];

        for (const volvoRecord of orderBookVolvo) {

            const existingRecord = existingMap.get(volvoRecord.ID);

            if (existingRecord) {

                // Atualiza os campos se os valores forem diferentes
                existingRecord.filial = updateIfDifferent(existingRecord.filial, volvoRecord.FILIAL);
                existingRecord.tipo = updateIfDifferent(existingRecord.tipo, volvoRecord.TIPO);
                existingRecord.pedido = updateIfDifferent(existingRecord.pedido, volvoRecord.PEDIDO);
                existingRecord.cod_cliente = updateIfDifferent(existingRecord.cod_cliente, volvoRecord.COD_CLIENTE);
                existingRecord.cliente = updateIfDifferent(existingRecord.cliente, volvoRecord.CLIENTE);
                existingRecord.data_do_pedido = updateIfDifferent(existingRecord.data_do_pedido, new Date(volvoRecord.DATA_DO_PEDIDO));
                existingRecord.vendedor = updateIfDifferent(existingRecord.vendedor, volvoRecord.VENDEDOR);
                existingRecord.chassi = updateIfDifferent(existingRecord.chassi, volvoRecord.CHASSI);
                existingRecord.departamento = updateIfDifferent(existingRecord.departamento, volvoRecord.DEPARTAMENTO);
                existingRecord.total = updateIfDifferent(existingRecord.total, volvoRecord.TOTAL);
                existingRecord.dias_em_aberto = updateIfDifferent(existingRecord.dias_em_aberto, volvoRecord.DIAS_EM_ABERTO);
                existingRecord.tipo_de_operacao = updateIfDifferent(existingRecord.tipo_de_operacao, volvoRecord.TIPO_DE_OPERACAO);

                recordsToUpdate.push(existingRecord);

            }
        }

        // Salva os registros atualizados em uma operação em massa
        if (recordsToUpdate.length) {

            await pedidoRepository.save(recordsToUpdate);

        }

        return `Registros atualizados com sucesso: ${recordsToUpdate.length}`;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar os registros');
    }
};

// Função principal de migração diária
const migrationDatabase = async (): Promise<string> => {

    console.log('Iniciando migração diária...');

    const messagesSuccess: string[] = [];
    const messagesError: string[] = [];

    // Captura o tempo de início da migração
    const startTime = Date.now();

    try {

        const createMigration = await migrationCreateRegisters().finally(async () => {

            const updateMigration = await migrationUpdateRegisters();

            if (updateMigration instanceof Error) {
                messagesError.push(updateMigration.message);
            } else {
                messagesSuccess.push(updateMigration);
            }

        });

        if (createMigration instanceof Error) {
            messagesError.unshift(createMigration.message);
        } else {
            messagesSuccess.unshift(createMigration);
        }

    } catch (error) {
        messagesError.push('Erro inesperado na migração de dados');
    }

    // Captura o tempo de término da migração
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2); // tempo em segundos

    // Cria a mensagem final corretamente
    const finalMessage = [
        messagesSuccess.length > 0 ? `Sucessos: ${messagesSuccess.join('; ')}` : '',
        messagesError.length > 0 ? `Erros: ${messagesError.join('; ')}` : '',
        `Tempo de execução: ${duration} segundos.`,
        'Migração diária finalizada.\n',
    ].filter(Boolean).join('\n'); // Filtra mensagens vazias e junta com nova linha

    return finalMessage;
};

// Função para executar a migração diariamente as 6 horas da manhã
export const dailyDatabaseMigration = async (): Promise<void> => {
    // Cronjob que executa a migração diariamente às 6 horas da manhã
    cron.schedule('05 09 * * *', async () => {
        const message = await migrationDatabase();
        console.log(message);
    });
};

