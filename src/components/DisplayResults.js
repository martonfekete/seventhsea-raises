import { Divider, Typography } from "@mui/material";
import React from "react";
import "./DisplayResults.css";

function DisplayResults({ results }) {
  const { rolls, raises, leftover } = results;
  return (
    <div className="results">
      {results.rolls && (
        <div style={{ paddingTop: "1rem" }}>
          <Divider />
          <Typography mt={2} mb={1} variant="h4" component="div">
            {raises > 0 && (
              <span>
                {raises} raise{raises > 1 && "s"}
              </span>
            )}
            {raises === 0 && <div>no raises</div>}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "normal" }}
            component="div"
          >
            <div>
              {rolls.length > 0 && (
                <div>Rolls: {rolls.sort((a, b) => b - a).join(", ")}</div>
              )}
            </div>
            <div>
              {leftover.length > 0 && <div>{leftover.length} leftover</div>}
            </div>
            <div>{leftover.length === 0 && <div>no leftover</div>}</div>
          </Typography>
        </div>
      )}
    </div>
  );
}

export default DisplayResults;
