import { useState } from "react";
import { Card } from "../../components/common/Card.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { SegBtn } from "../../components/common/SegmentButton.jsx";
import { Metric } from "../../components/common/Metric.jsx";

import { fmt, fmtSmart } from "../../utils/format";
import { EDU_PATTERNS } from "../../constants/appData";

import {
  selectCurrentAge,
  selectLoanMonthly,
  selectChildBirthAge
} from "./lifeSelectors";

import {
  addChild,
  updateChildField,
  removeChild,
  updateLifeField
} from "./lifeActions";

import {
  ChildCard,
  ChildDetail,
  MarriageSection,
  HousingSection
} from "./lifeComponents";

export const LifeTab = ({ st, set }) => {
  const [activeChild, setActiveChild] = useState(null);

  const currentAge = selectCurrentAge(st);
  const loanMonthly = selectLoanMonthly(st);

  return (
    <div>
      {/* 結婚 */}
      <MarriageSection
        st={st}
        set={set}
        currentAge={currentAge}
        updateLifeField={updateLifeField}
      />

      {/* 子供 */}
      <Card title="子供・教育費" style={{ marginBottom: 12 }}>
        {st.children.map(child => {
          const birthAge = selectChildBirthAge(st, child);
          const eduPat = EDU_PATTERNS[child.eduPattern];

          return (
            <div key={child.id} style={{ marginBottom: 10 }}>
              <ChildCard
                child={child}
                activeChild={activeChild}
                setActiveChild={setActiveChild}
                birthAge={birthAge}
                eduPat={eduPat}
                removeChild={() => removeChild(set, child.id)}
              />

              {activeChild === child.id && (
                <ChildDetail
                  child={child}
                  updateChildField={(key, val) =>
                    updateChildField(set, child.id, key, val)
                  }
                />
              )}
            </div>
          );
        })}

        <button
          onClick={() => addChild(set, st.children.length)}
          style={{
            fontSize: 12,
            padding: "7px 14px",
            borderRadius: "var(--radius)",
            border: "0.5px solid var(--border-accent)",
            background: "var(--bg-accent)",
            cursor: "pointer",
            color: "var(--text-accent)",
            display: "flex",
            alignItems: "center",
            gap: 5
          }}
        >
          <i className="ti ti-plus" aria-hidden="true" />子供を追加
        </button>
      </Card>

      {/* 住宅 */}
      <HousingSection
        st={st}
        set={set}
        currentAge={currentAge}
        loanMonthly={loanMonthly}
        updateLifeField={updateLifeField}
      />
    </div>
  );
}
