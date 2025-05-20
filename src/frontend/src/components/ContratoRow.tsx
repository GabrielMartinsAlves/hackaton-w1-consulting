import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye as faEyeRegular } from '@fortawesome/free-regular-svg-icons';
import { faPen, faPenToSquare as faPenToSquareRegular } from '@fortawesome/free-solid-svg-icons';
import StatusIcon from './StatusIcon';

export default function ContratoRow({ nome, status, acao }: Props) {
  const actionIcon = {
    ver: faEyeRegular,
    editar: faPenToSquareRegular,
    caneta: faPen,
  }[acao];

  return (
    <div className="grid grid-cols-[7fr_2fr_2fr] items-center text-sm px-4 py-4 border-t border-[#DDDDDD] bg-white text-black">
      <span>{nome}</span>
      <div className="flex justify-center">
        <StatusIcon status={status} />
      </div>
      <div className="flex justify-end">
        <FontAwesomeIcon icon={actionIcon} className="text-[18px] text-black" />
      </div>
    </div>
  );
}
