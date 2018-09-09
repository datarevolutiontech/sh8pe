## Note, requires pip install json-rpc
## pip install 'jsonrpcclient[requests]'
## pip install ethjsonrpc

import requests
import json
import jsonrpcclient

node_url = '127.0.0.1' # Local node

## https://ropsten.etherscan.io/address/0x66b171a550d67a2d1907d63ec58b8320772801e3
contract_address = '66b171a550d67a2d1907d63ec58b8320772801e3'

from ethjsonrpc import EthJsonRpc
c = EthJsonRpc(node_url, 8545)

# Test connect
blockHeight = c.eth_blockNumber()
print('')
print(blockHeight)

## https://ropsten.etherscan.io/address/0xe2356d29d5dfecb4ee43c031204aeded24749959
contract_owner = 'e2356d29d5dfecb4ee43c031204aeded24749959' # Test rpc

y = 1000
for x in range(0, y):
    tx = c.call_with_transaction(contract_owner, contract_address, 'add(uint256,uint256,address,bytes32)', 1,1,'0xe2356d29d5dfecb4ee43c031204aeded24749959,''')
    print(tx)

print()