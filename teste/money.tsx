import { NumericFormat } from "react-number-format";

export function MsTextInputMoney({ label, htmlFor, ...rest }) {
  return <NumericFormat {...rest} />;
}
