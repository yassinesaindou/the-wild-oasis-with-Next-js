"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeFilter = searchParams.get("capacity");
  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  return (
    <div className=" border border-primary-800 flex">
      <Button
        handleFilter={handleFilter}
        filter="all"
        activeFilter={activeFilter}>
        All Cabins
      </Button>
      <Button
        handleFilter={handleFilter}
        filter="small"
        activeFilter={activeFilter}>
        1&mdash;3 guests
      </Button>
      <Button
        handleFilter={handleFilter}
        filter="medium"
        activeFilter={activeFilter}>
        4&mdash;7 guests
      </Button>
      <Button
        filter="large"
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ children, handleFilter, filter, activeFilter }) {
  return (
    <button
      className={`${
        activeFilter === filter ? "bg-primary-700 text-primary-100" : ""
      }px-5 py-2 hover:bg-primary-700`}
      onClick={() => handleFilter(filter)}>
      {children}
    </button>
  );
}
