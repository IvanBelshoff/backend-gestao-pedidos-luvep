import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
    expression: `
    SELECT 
      "LYBRNN", 
      "LYORNO", 
      "LYAMNT",
    FROM "in_gds_STG_THF311_V"
  `
})
export class in_gds_STG_THF311_V {

    @ViewColumn({ name: "LYBRNN" })
    FILIAL: number;

    @ViewColumn({ name: "LYORNO" })
    PEDIDO: number;

    @ViewColumn({ name: "LYAMNT" })
    TOTAL: number;

}
