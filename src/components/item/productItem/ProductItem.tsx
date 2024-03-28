import * as gtag from '../../../helpers/gtag';

type ProductItemType = {
  item: any;
};

export default function ProductItem({ item }: ProductItemType) {
  const handleItemClick = (item: any) => {
    const { no, name, url } = item;

    // GA
    gtag.event('view_item', {
      event_category: 'Item',
      event_label: name,
      value: no,
    });

    window.open(url, '_blank');
  };

  return (
    <div
      className={`item h-20 w-full flex items-center bg-red-400 text-white cursor-pointer rounded-lg p-2 gap-2`}
      key={item._id}
      onClick={() => handleItemClick(item)}
    >
      <div className="relative w-16 h-16 min-h-16 min-w-16 rounded-lg overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="items-start flex flex-col ">
        <div className="min-w-16">{`[${String(item.no).padStart(
          4,
          '0'
        )}]`}</div>
        <div className="break-keep line-clamp-2 leading-5 font-bold">
          {item.name}
        </div>
      </div>
    </div>
  );
}
