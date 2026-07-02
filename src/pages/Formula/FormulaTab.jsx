import { getFormulaSections } from "../Formula/formulaSelectors";
import { FormulaItem, DisclaimerBox } from "../Formula/FormulaComponents";
import { Card } from "../../components/common/Card.jsx";

export const FormulaTab = () => {
  const sections = getFormulaSections();

  return (
    <div>
      {sections.map((section, si) => (
        <Card key={si} title={section.title} style={{ marginBottom: 14 }}>
          {section.items.map((item, ii) => (
            <FormulaItem key={ii} label={item.label} formula={item.formula} />
          ))}
        </Card>
      ))}

      <DisclaimerBox />
    </div>
  );
}
