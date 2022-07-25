import { Button, Checkbox, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import { OPTION_KEYS, rollAndCalculate } from "../assets/raiseCalculator";
import DisplayResults from "../components/DisplayResults";
import FiveSelector from "../components/FiveSelectorContainer";
import "./Raises.css";

function Raisey() {
  const [traitRank, setTraitRank] = useState(2);
  const [skillRank, setSkillRank] = useState(0);
  const [flair, setFlair] = useState(2);
  const [legendary, setLegendary] = useState(false);
  const [plusOne, setPlusOne] = useState(false);
  const [rollResults, setRollResults] = useState({});

  function roll() {
    const options = {
      [OPTION_KEYS.LEGENDARY]: legendary,
      [OPTION_KEYS.REROLL]: skillRank > 2,
      [OPTION_KEYS.FIFTEEN]: skillRank > 3,
      [OPTION_KEYS.EXPLODE]: skillRank === 5,
      [OPTION_KEYS.setPlusOne]: plusOne,
    };
    const results = rollAndCalculate(traitRank + skillRank + flair, options);
    setRollResults(results);
  }

  return (
    <Container>
      <Grid container rowSpacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Typography
            mt={2}
            mb={2}
            sx={{ textAlign: "center" }}
            variant="h4"
            component="div"
          >
            Calculate raises
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">Trait rank</Typography>
        </Grid>
        <Grid item xs={8}>
          <FiveSelector selected={traitRank} valueSet={setTraitRank} />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">Skill rank</Typography>
        </Grid>
        <Grid item xs={8}>
          <FiveSelector selected={skillRank} valueSet={setSkillRank} />
        </Grid>
        <Grid item xs={5} alignContent="center">
          <Typography className="checkbox-label" variant="h6">
            Legendary trait
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Checkbox
            checked={legendary}
            sx={{ padding: 0, paddingTop: "5px" }}
            onChange={(e) => setLegendary(e.target.checked)}
          />
        </Grid>
        <Grid item xs={5}>
          <Typography className="checkbox-label" variant="h6">
            All dice face +1
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Checkbox
            sx={{ padding: 0, paddingTop: "5px" }}
            checked={plusOne}
            onChange={(e) => setPlusOne(e.target.checked)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Extra dice
            <span
              style={{
                marginLeft: ".5rem",
                fontSize: "small",
                fontWeight: "normal",
                position: "relative",
                top: "-2px",
              }}
            >
              (flair, HP spend, advantages)
            </span>
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ paddingTop: 0 }}>
          <FiveSelector selected={flair} maxValue={10} valueSet={setFlair} />
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            size="large"
            className="raise-button"
            onClick={() => roll()}
          >
            Roll the bones!
          </Button>
        </Grid>
      </Grid>
      <DisplayResults results={rollResults}></DisplayResults>
    </Container>
  );
}

export default Raisey;
