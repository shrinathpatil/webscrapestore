import Image from "next/image";

interface Props {
  title: string;
  iconSrc: string;
  value: string;
  borderColor: string;
  bgColor: string;
}

const PriceInfoCard = ({
  title,
  iconSrc,
  value,
  borderColor,
  bgColor,
}: Props) => {
  return (
    <div className={`price-info_card   ${borderColor} ${bgColor}`}>
      <p className="text-base text-black-100">{title}</p>
      <div className="flex gap-2">
        <Image src={iconSrc} alt={title} width={24} height={24} />
        <p className="text-2xl font-bold text-secondary">{value}</p>
      </div>
    </div>
  );
};

export default PriceInfoCard;
