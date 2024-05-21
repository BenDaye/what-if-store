import { default as si } from 'systeminformation';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

const stringInput = z.object({ params: z.string() });
const optionalStringInput = stringInput.partial();
const optionalBooleanInput = z.object({ params: z.optional(z.boolean()) });

export const systemInformationRouter = router({
  version: publicProcedure.query(async () => si.version()),
  system: publicProcedure.query(async () => await si.system()),
  bios: publicProcedure.query(async () => await si.bios()),
  baseboard: publicProcedure.query(async () => await si.baseboard()),
  chassis: publicProcedure.query(async () => await si.chassis()),

  time: publicProcedure.query(async () => si.time()),
  osInfo: publicProcedure.query(async () => await si.osInfo()),
  versions: publicProcedure
    .input(optionalStringInput)
    .query(async ({ input }) => await si.versions(input?.params)),
  shell: publicProcedure.query(async () => await si.shell()),
  uuid: publicProcedure.query(async () => await si.uuid()),

  cpu: publicProcedure.query(async () => await si.cpu()),
  cpuFlags: publicProcedure.query(async () => await si.cpuFlags()),
  cpuCache: publicProcedure.query(async () => await si.cpuCache()),
  cpuCurrentSpeed: publicProcedure.query(async () => await si.cpuCurrentSpeed()),
  cpuTemperature: publicProcedure.query(async () => await si.cpuTemperature()),
  currentLoad: publicProcedure.query(async () => await si.currentLoad()),
  fullLoad: publicProcedure.query(async () => await si.fullLoad()),

  mem: publicProcedure.query(async () => await si.mem()),
  memLayout: publicProcedure.query(async () => await si.memLayout()),

  battery: publicProcedure.query(async () => await si.battery()),
  graphics: publicProcedure.query(async () => await si.graphics()),

  fsSize: publicProcedure
    .input(optionalStringInput)
    .query(async ({ input }) => await si.fsSize(input?.params)),
  fsOpenFiles: publicProcedure.query(async () => await si.fsOpenFiles()),
  blockDevices: publicProcedure.query(async () => await si.blockDevices()),
  fsStats: publicProcedure.query(async () => await si.fsStats()),
  disksIO: publicProcedure.query(async () => await si.disksIO()),
  diskLayout: publicProcedure.query(async () => await si.diskLayout()),

  networkInterfaceDefault: publicProcedure.query(async () => await si.networkInterfaceDefault()),
  networkGatewayDefault: publicProcedure.query(async () => await si.networkGatewayDefault()),
  networkInterfaces: publicProcedure.query(async () => await si.networkInterfaces()),

  networkStats: publicProcedure
    .input(optionalStringInput)
    .query(async ({ input }) => await si.networkStats(input?.params)),
  networkConnections: publicProcedure.query(async () => await si.networkConnections()),
  inetChecksite: publicProcedure
    .input(stringInput)
    .query(async ({ input }) => await si.inetChecksite(input?.params)),
  inetLatency: publicProcedure
    .input(optionalStringInput)
    .query(async ({ input }) => await si.inetLatency(input?.params)),

  wifiNetworks: publicProcedure.query(async () => await si.wifiNetworks()),
  wifiInterfaces: publicProcedure.query(async () => await si.wifiInterfaces()),
  wifiConnections: publicProcedure.query(async () => await si.wifiConnections()),

  users: publicProcedure.query(async () => await si.users()),

  processes: publicProcedure.query(async () => await si.processes()),
  processLoad: publicProcedure
    .input(stringInput)
    .query(async ({ input }) => await si.processLoad(input?.params)),
  services: publicProcedure.input(stringInput).query(async ({ input }) => await si.services(input?.params)),

  dockerInfo: publicProcedure.query(async () => await si.dockerInfo()),
  dockerImages: publicProcedure
    .input(optionalBooleanInput)
    .query(async ({ input }) => await si.dockerImages(input?.params)),
  dockerContainers: publicProcedure
    .input(optionalBooleanInput)
    .query(async ({ input }) => await si.dockerContainers(input?.params)),
  dockerContainerStats: publicProcedure
    .input(optionalStringInput)
    .query(async ({ input }) => await si.dockerContainerStats(input?.params)),
  dockerContainerProcesses: publicProcedure
    .input(optionalStringInput)
    .query(async ({ input }) => await si.dockerContainerProcesses(input?.params)),
  dockerVolumes: publicProcedure.query(async () => await si.dockerVolumes()),
  dockerAll: publicProcedure.query(async () => await si.dockerAll()),

  vboxInfo: publicProcedure.query(async () => await si.vboxInfo()),

  printer: publicProcedure.query(async () => await si.printer()),

  usb: publicProcedure.query(async () => await si.usb()),

  audio: publicProcedure.query(async () => await si.audio()),

  bluetoothDevices: publicProcedure.query(async () => await si.bluetoothDevices()),

  getStaticData: publicProcedure.query(async () => await si.getStaticData()),
  getDynamicData: publicProcedure
    .input(
      z
        .object({
          srv: z.string(),
          iface: z.string(),
        })
        .partial()
        .optional(),
    )
    .query(async ({ input }) => await si.getDynamicData(input?.srv, input?.iface)),
});
