import React, { useState } from "react";
import moment from "moment"; 

const Notice = ({ idx, notice, notFor }) => {
  const isNew = moment().diff(moment(notice.date), "hours") <= 24; // Check if notice is less than 24 hours old
  return (
    notFor !== notice.noticeFor && (
      <div className="flex shadow-md py-2 px-2 rounded-lg bg-slate-50 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer h-10">
        ⚫
        <h1 className="font-bold ml-3 overflow-hidden text-ellipsis w-[15rem]">
          {notice.topic}
          {notice.topic}
          {notice.topic}
          {notice.topic}
          {notice.topic}
          {notice.topic}
        </h1>
        <p className="text-ellipsis w-[25rem] overflow-hidden">
          {notice.content}
        </p>
        {isNew && (
          <span className="ml-2 text-green-500 font-bold">New</span> // Add "New" badge
        )}
      </div>
    )
  );
};

export default Notice;
