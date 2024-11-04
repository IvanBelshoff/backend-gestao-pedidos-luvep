import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
    expression: `
        SELECT 
        "LXBRNN", 
        "LXORNO", 
        "LXUPPR"
        FROM "in_gds_STG_THF310_V"
  `
})
export class in_gds_STG_THF310_V {

    @ViewColumn({ name: "LXBRNN" })
    FILIAL: number;

    @ViewColumn({ name: "LXORNO" })
    PEDIDO: number;

    @ViewColumn({ name: "LXUPPR" })
    TOTAL: number;

}
