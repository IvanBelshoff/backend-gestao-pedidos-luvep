import { differenceInDays } from "date-fns";
import { ViewEntity, ViewColumn, DataSource } from "typeorm";

@ViewEntity({
    expression: `
    SELECT 
      "AJGNN2", 
      "AJORNO", 
      "AJCNUM", 
      "AJCA30", 
      "AJORDT", 
      "AJNMI1", 
      "AJCHNO", 
      "AJDPNO", 
      "AJSRCD", 
      "AJSTCN"
    FROM "in_gds_STG_THF010_V"
  `
})
export class in_gds_STG_THF010_V {

    @ViewColumn({ name: "AJGNN2" })
    FILIAL: number;

    @ViewColumn({ name: "AJORNO" })
    PEDIDO: number;

    @ViewColumn({ name: "AJCA30" })
    CLIENTE: string;

    @ViewColumn({
        name: "AJORDT",
        transformer: {
            to: (value: Date[]) => value[0], // sem transformação ao salvar
            from: (value: Date[]) => value[0], // formato DD/MM/YYYY ao recuperar
        },
    })
    DATA_DO_PEDIDO: Date;

    @ViewColumn({ name: "AJNMI1" })
    VENDEDOR: string;

    @ViewColumn({ name: "AJCHNO" })
    CHASSI: string;

    @ViewColumn({ name: "AJDPNO" })
    DEPARTAMENTO: number;

    @ViewColumn({
        name: "AJORDT",
        transformer: {
            to: (value: Date[]) => value[1],
            from: (value: Date[]) => differenceInDays(new Date(), value[1]), // calcula dias em aberto
        },
    })
    DIAS_EM_ABERTO: number;

    @ViewColumn({ name: "AJSRCD" })
    TIPO_DE_OPERACAO: string;

    @ViewColumn({ name: "AJSTCN" })
    DESCONHECIDO: string;
}
