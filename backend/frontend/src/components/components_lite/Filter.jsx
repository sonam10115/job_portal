import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Delhi",
      "Mumbai",
      "Kolhapur",
      "Pune",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Remote",
    ],
  },
  {
    filterType: "Technology",
    array: [
      "Mern",
      "React",
      "Data Scientist",
      "Fullstack",
      "Node",
      "Python",
      "Java",
      "frontend",
      "backend",
      "mobile",
      "desktop",
    ],
  },
  {
    filterType: "Experience",
    array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"],
  },
  {
    filterType: "Salary",
    array: ["0-50k", "50k-100k", "100k-200k", "200k+"],
  },
];

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const set = () => setIsDesktop(mq.matches);
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);

  return (
    <div className="w-full bg-white rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={handleChange}>
        {filterData.map((data, index) => (
          <details
            key={`${data.filterType}-${index}`}
            className="mb-4 group bg-white"
            open={isDesktop}
          >
            <summary className="flex items-center justify-between cursor-pointer py-2 font-bold text-lg list-none">
              <span>{data.filterType}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200 group-open:-rotate-180" />
            </summary>

            <div className="mt-2">
              {data.array.map((item, indx) => {
                const itemId = `Id${index}-${indx}`;
                return (
                  <div
                    key={itemId}
                    className="flex items-center space-x-2 my-2"
                  >
                    <RadioGroupItem value={item} id={itemId} />
                    <label
                      htmlFor={itemId}
                      className="cursor-pointer select-none"
                    >
                      {item}
                    </label>
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Filter;
