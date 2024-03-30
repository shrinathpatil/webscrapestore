import { Product } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: Product;
}
const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={product.image}
          width={200}
          height={200}
          alt={product.title}
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>
        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">
            {product.category}
          </p>
          <p className="text-black text-lg font-semibold">
            <span className="">{product.currency}</span>
            <span className="">{product.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
