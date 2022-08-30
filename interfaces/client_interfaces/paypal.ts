
export type OrderResponseBody = {
    id: string;
    status: "SAVED" | "APPROVED" | "VOIDED" | "COMPLETED" | "PAYER_ACTION_REQUIRED";
}