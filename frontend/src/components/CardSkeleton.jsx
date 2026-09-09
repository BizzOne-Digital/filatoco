const CardSkeleton = ({ count = 4, aspect = 'aspect-[4/5]' }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="overflow-hidden rounded-xl2 bg-offwhite shadow-soft">
        <div className={`${aspect} animate-pulse bg-beige`} />
        <div className="space-y-2 p-4">
          <div className="mx-auto h-3 w-3/4 animate-pulse rounded bg-beige" />
          <div className="mx-auto h-3 w-1/3 animate-pulse rounded bg-beige" />
        </div>
      </div>
    ))}
  </>
);

export default CardSkeleton;
