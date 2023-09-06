import { useState } from "react";
import { Resource } from "../definitions/ResourceDefinitions";
import { notifyGameStateUpdate } from "../Global";
import { getWarehouseCapacity } from "../logic/BuildingLogic";
import { Tick } from "../logic/TickLogic";
import { IResourceImport, IResourceImportBuildingData } from "../logic/Tile";
import { clamp, reduceOf, safeParseInt } from "../utilities/Helper";
import { L, t } from "../utilities/i18n";
import { hideModal } from "./GlobalModal";
import { FormatNumber } from "./HelperComponents";

export function ChangeResourceImportModal({
   building,
   resource,
}: {
   building: IResourceImportBuildingData;
   resource: Resource;
}) {
   const [resourceImport, setResourceImport] = useState<IResourceImport>(
      building.resourceImports[resource] ?? { cap: 0, perCycle: 0 }
   );
   const totalCapacity = getWarehouseCapacity(building);
   const usedCapacity = reduceOf(building.resourceImports, (prev, res, val) => prev + val.perCycle, 0);
   const max = clamp(totalCapacity - usedCapacity, 0, totalCapacity);
   const isValid = resourceImport.perCycle >= 0 && resourceImport.perCycle <= max;
   return (
      <div className="window">
         <div className="title-bar">
            <div className="title-bar-text">
               {t(L.ResourceImportSettings, { res: Tick.current.resources[resource].name() })}
            </div>
            <div className="title-bar-controls">
               <button onClick={hideModal} aria-label="Close"></button>
            </div>
         </div>
         <div className="window-body">
            <div className="row mv5">
               <div style={{ width: "60px" }}>{t(L.ResourceImportImportPerCycle)}</div>
               <input
                  className="f1 text-right w100"
                  type="text"
                  value={resourceImport.perCycle}
                  onChange={(e) => {
                     setResourceImport({ ...resourceImport, perCycle: safeParseInt(e.target.value) });
                  }}
               />
            </div>
            <div className="text-desc text-right text-small">
               0 ~ <FormatNumber value={max} />
            </div>
            <div className="sep5"></div>
            <div className="row mv5">
               <div style={{ width: "60px" }}>{t(L.ResourceImportImportCap)}</div>
               <input
                  className="f1 text-right w100"
                  type="text"
                  value={resourceImport.cap}
                  onChange={(e) => {
                     setResourceImport({ ...resourceImport, cap: safeParseInt(e.target.value) });
                  }}
               />
            </div>
            <div className="sep10"></div>
            <div className="row" style={{ justifyContent: "flex-end" }}>
               <button
                  disabled={!isValid}
                  onClick={() => {
                     building.resourceImports[resource] = resourceImport;
                     notifyGameStateUpdate();
                     hideModal();
                  }}
               >
                  {t(L.ChangePlayerHandle)}
               </button>
               <div style={{ width: "10px" }}></div>
               <button onClick={hideModal}>{t(L.ChangePlayerHandleCancel)}</button>
            </div>
         </div>
      </div>
   );
}