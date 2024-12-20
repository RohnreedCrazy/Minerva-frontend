import ProgressBar from "components/ProgressBar";
import ReferNavigation from "components/refer/ReferNavigation";
import Referrer from "components/refer/steps/Referrer";
import General from "components/refer/steps/General";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userType } from "libs/isAuth";

export default function Refer() {
  const type = userType();
  const [candidate, setCandidate] = useState({});
  const [referrer, setReferrer] = useState({});
  const [general, setGeneral] = useState({
    open: "I don't know.",
    status: "In progress",
    share: "No, I will get 100%.",
  });

  let indices = 3;
  let [index, setIndex] = useState(0);

  let addCandidate = (value) => setCandidate(value);
  let addGeneral = (value) => setGeneral(value);
  let addReferrer = (value) => setReferrer(value);
  let progress = Math.floor((100 / (indices - 1)) * index);

  useEffect(() => {
    if (type === "applicant") {
      axios
        .get("applicant")
        .then((res) => {
          let data = res.data();
          setReferrer({
            ...referrer,
            name: data.name,
            title: data.title,
            linkedin: data.linkedin,
            email: data.email,
          });
        })
        .catch((err) => { 
          console.log(err);
        });
    }
    // console.log("type: ", type);
  }, [type]);

  function changeIndex(value) {
    window.scrollTo(0, 0);
    setIndex(value);
  }

  function isComplete(index) {
    if (index === 0) {
      if (
        candidate.name &&
        candidate.title &&
        candidate.email &&
        candidate.linkedin
      ) {
        return true;
      }
      return false;
    } else if (index === 1) {
      if (referrer.motivation) {
        return true;
      }
      return false;
    } else if (index === 2) {
      return true;
    } else if (index === 3) {
      if (
        referrer.name &&
        referrer.title &&
        referrer.email &&
        referrer.linkedin
      ) {
        return true;
      }
      return false;
    }
  }

  function generateStep(value) {
    switch (value) {     
      case 0:
        return <Referrer referrer={referrer} addReferrer={addReferrer} />;
      case 1: {
        return <General general={general} addGeneral={addGeneral} />;
      }
    }
  }

  return (
    <div className="bg-gray-200 md:py-24 py-12 pt-20">
      <canvas id="my-canvas" className="absolute z-0"></canvas>
      <div className="bg-white rounded-2xl pt-10 md:px-8 px-6 pb-8 text-left md:w-5/12 w-11/12 mx-auto mt-20">
        <ProgressBar value={progress} />
        {generateStep(index)}
        <ReferNavigation
          index={index}
          changeIndex={changeIndex}
          isComplete={isComplete}
        />
      </div>
    </div>
  );
}
