import { Module } from "@medusajs/framework/utils";
import DigitalModuleService from "./service";
export const DIGITAL_MODULE = "digital";
export default Module(DIGITAL_MODULE, { service: DigitalModuleService });
