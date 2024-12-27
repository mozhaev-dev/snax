import os, { networkInterfaces, NetworkInterfaceInfo } from 'os'

type IpParams = {
  addr: string
  mask: string
}

type AvailableInterface = {
  name: string
  mac: string
  ipv4: IpParams[]
  ipv6: IpParams[]
}

export const getAvailableInterfaces = (): AvailableInterface[] => {
  return Object.entries(networkInterfaces()).reduce<AvailableInterface[]>(
    (acc, item) => {
      const [interfaceName, interfaceParams] = item
      const validAddresses =
        interfaceParams?.filter(item => !item.internal) ?? []

      if (!validAddresses.length) return acc

      const { ipv4, ipv6 } = validAddresses.reduce<{
        ipv4: IpParams[]
        ipv6: IpParams[]
      }>(
        (acc, item) => {
          const ipParams: IpParams = {
            addr: item.address,
            mask: item.netmask,
          }
          if (item.family === 'IPv4') {
            acc.ipv4.push(ipParams)
          } else {
            acc.ipv6.push(ipParams)
          }
          return acc
        },
        {
          ipv4: [],
          ipv6: [],
        }
      )

      return [
        ...acc,
        {
          name: interfaceName,
          mac: validAddresses[0].mac,
          ipv4,
          ipv6,
        },
      ]
    },
    []
  )
}
