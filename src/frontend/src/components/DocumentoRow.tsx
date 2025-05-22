import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye as faEyeRegular,
  faPenToSquare as faPenToSquareRegular,
} from '@fortawesome/free-regular-svg-icons';
import StatusIcon from './StatusIcon';

interface Props {
  nome: string;
  status: 'ok' | 'pendente' | 'erro';
}

export default function DocumentoRow({ nome, status }: Props) {
  return (
    <div className="grid grid-cols-[7fr_2fr_2fr] items-center text-sm px-4 py-4 border-t border-[#DDDDDD] bg-white text-black">
      <span>{nome}</span>
      <div className="flex justify-center">
        <StatusIcon status={status} />
      </div>
      <div className="flex justify-end gap-4">
        {status === 'ok' ? (
          <FontAwesomeIcon icon={faEyeRegular} className="text-[18px] h-5 w-5 text-black cursor-pointer font" />
        ) : (
          <FontAwesomeIcon icon={faPenToSquareRegular} className="text-[18px] h-5 w-5 text-black cursor-pointer" />
        )}
      </div>
    </div>
  );
}
