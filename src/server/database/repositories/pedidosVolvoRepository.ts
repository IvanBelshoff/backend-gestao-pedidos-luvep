/* eslint-disable quotes */
import { in_gds_STG_THF010_VRepository } from ".";
import { in_gds_STG_THF311_V, in_gds_STG_THF310_V } from "../entities";

export class PedidoVolvo {

    public ID: string;
    public TIPO: string;
    public FILIAL: number;
    public PEDIDO: number;
    public COD_CLIENTE: number;
    public CLIENTE: string;
    public DATA_DO_PEDIDO: string;
    public VENDEDOR: string;
    public CHASSI: string;
    public DEPARTAMENTO: number;
    public TOTAL: number;
    public DIAS_EM_ABERTO: number;
    public TIPO_DE_OPERACAO: string;

    public static async find(): Promise<PedidoVolvo[]> {

        const queryServicos: PedidoVolvo[] = await in_gds_STG_THF010_VRepository.createQueryBuilder('in_gds_STG_THF010_V')
            .select("CONVERT(VARCHAR(50), HASHBYTES('SHA1', CONCAT('Serviços', in_gds_STG_THF010_V.AJGNN2, in_gds_STG_THF010_V.AJORNO, CONVERT(VARCHAR, in_gds_STG_THF010_V.AJORDT, 103))), 2)", "ID")
            .addSelect("'Serviços'", "TIPO")
            .addSelect("in_gds_STG_THF010_V.AJGNN2", "FILIAL")
            .addSelect("in_gds_STG_THF010_V.AJORNO", "PEDIDO")
            .addSelect("in_gds_STG_THF010_V.AJCNUM", "COD_CLIENTE")
            .addSelect("in_gds_STG_THF010_V.AJCA30", "CLIENTE")
            .addSelect("CONVERT(VARCHAR, in_gds_STG_THF010_V.AJORDT, 103)", "DATA_DO_PEDIDO")
            .addSelect("in_gds_STG_THF010_V.AJNMI1", "VENDEDOR")
            .addSelect("in_gds_STG_THF010_V.AJCHNO", "CHASSI")
            .addSelect("in_gds_STG_THF010_V.AJDPNO", "DEPARTAMENTO")
            .addSelect("SUM(T2.LYAMNT)", "TOTAL")
            .addSelect("CONVERT(INT, GETDATE() - in_gds_STG_THF010_V.AJORDT)", "DIAS_EM_ABERTO")
            .addSelect("in_gds_STG_THF010_V.AJSRCD", "TIPO_DE_OPERACAO")
            .innerJoin(in_gds_STG_THF311_V, "T2", "in_gds_STG_THF010_V.AJGNN2 = T2.LYBRNN AND in_gds_STG_THF010_V.AJORNO = T2.LYORNO")
            .where("in_gds_STG_THF010_V.AJSTCN IN (:...statuses)", { statuses: ['0', '1'] }) // Corrigido para usar um array
            .andWhere("in_gds_STG_THF010_V.AJSRCD NOT LIKE :tipoOperacao", { tipoOperacao: 'T%' }) // Mantenha a referência para o parâmetro
            .groupBy("in_gds_STG_THF010_V.AJGNN2")
            .addGroupBy("in_gds_STG_THF010_V.AJORNO")
            .addGroupBy("in_gds_STG_THF010_V.AJCNUM")
            .addGroupBy("in_gds_STG_THF010_V.AJCA30")
            .addGroupBy("in_gds_STG_THF010_V.AJORDT")
            .addGroupBy("in_gds_STG_THF010_V.AJNMI1")
            .addGroupBy("in_gds_STG_THF010_V.AJCHNO")
            .addGroupBy("in_gds_STG_THF010_V.AJDPNO")
            .addGroupBy("in_gds_STG_THF010_V.AJSRCD")
            .getRawMany();

        const queryPecas: PedidoVolvo[] = await in_gds_STG_THF010_VRepository.createQueryBuilder('in_gds_STG_THF010_V')
            .select("CONVERT(VARCHAR(50), HASHBYTES('SHA1', CONCAT('Peças', in_gds_STG_THF010_V.AJGNN2, in_gds_STG_THF010_V.AJORNO, CONVERT(VARCHAR, in_gds_STG_THF010_V.AJORDT, 103))), 2)", "ID")
            .addSelect("'Peças'", "TIPO")
            .addSelect("in_gds_STG_THF010_V.AJGNN2", "FILIAL")
            .addSelect("in_gds_STG_THF010_V.AJORNO", "PEDIDO")
            .addSelect("in_gds_STG_THF010_V.AJCNUM", "COD_CLIENTE")
            .addSelect("in_gds_STG_THF010_V.AJCA30", "CLIENTE")
            .addSelect("CONVERT(VARCHAR, in_gds_STG_THF010_V.AJORDT, 103)", "DATA_DO_PEDIDO")
            .addSelect("in_gds_STG_THF010_V.AJNMI1", "VENDEDOR")
            .addSelect("in_gds_STG_THF010_V.AJCHNO", "CHASSI")
            .addSelect("in_gds_STG_THF010_V.AJDPNO", "DEPARTAMENTO")
            .addSelect("SUM(T3.LXUPPR)", "TOTAL") // Somando o preço das peças
            .addSelect("CONVERT(INT, GETDATE() - in_gds_STG_THF010_V.AJORDT)", "DIAS_EM_ABERTO")
            .addSelect("in_gds_STG_THF010_V.AJSRCD", "TIPO_DE_OPERACAO")
            .innerJoin(in_gds_STG_THF310_V, "T3", "in_gds_STG_THF010_V.AJGNN2 = T3.LXBRNN AND in_gds_STG_THF010_V.AJORNO = T3.LXORNO")
            .where("in_gds_STG_THF010_V.AJSTCN IN (:...statuses)", { statuses: ['0', '1'] }) // Usando um array para status
            .andWhere("in_gds_STG_THF010_V.AJSRCD NOT LIKE :tipoOperacao", { tipoOperacao: 'T%' }) // Mantenha a referência para o parâmetro
            .groupBy("in_gds_STG_THF010_V.AJORNO")
            .addGroupBy("in_gds_STG_THF010_V.AJGNN2")
            .addGroupBy("in_gds_STG_THF010_V.AJCA30")
            .addGroupBy("in_gds_STG_THF010_V.AJCNUM")
            .addGroupBy("in_gds_STG_THF010_V.AJORDT")
            .addGroupBy("in_gds_STG_THF010_V.AJNMI1")
            .addGroupBy("in_gds_STG_THF010_V.AJCHNO")
            .addGroupBy("in_gds_STG_THF010_V.AJDPNO")
            .addGroupBy("in_gds_STG_THF010_V.AJSRCD")
            .getRawMany();

        const pedidosVolvo = [...queryServicos, ...queryPecas];

        return pedidosVolvo;
    }

}
