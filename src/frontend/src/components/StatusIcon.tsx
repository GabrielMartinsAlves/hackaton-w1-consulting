import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle as faCheckCircleRegular,
  faTimesCircle as faTimesCircleRegular,
  faClock as faClockRegular,
} from '@fortawesome/free-regular-svg-icons';

interface Props {
  status: 'ok' | 'pendente' | 'erro';
}

export default function StatusIcon({ status }: Props) {
  const map = {
    ok: { icon: faCheckCircleRegular, color: 'text-[#2FB8BC]' },
    pendente: { icon: faClockRegular, color: 'text-[#FFC857]' },
    erro: { icon: faTimesCircleRegular, color: 'text-[#E15554]' },
  };

  const { icon, color } = map[status];

  return <FontAwesomeIcon icon={icon} className={`text-[18px] ${color}`} />;
}
