import type { OrderStatus } from "../interface";
import { STATUS_LABEL, STATUS_STYLE } from "../utils/status";

const StatusBadge = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}
  >
    {STATUS_LABEL[status]}
  </span>
);

export default StatusBadge;