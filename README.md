# Token Terms Data Sheet

**Disclaimer**

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES
OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

ERC20 Fields
============

| **Property** | **Value**   | **Notes**                                                                              |
|--------------|-------------|----------------------------------------------------------------------------------------|
| Name         | Sh8pe Token |                                                                                        |
| Ticker       | Sh8pe       |                                                                                        |
| Decimals     | 18          | Default= 18 (‘soft standard’ reflecting rough proportional parity between WEI and ETH) |
| Total Supply | 100,000,000 | Total tokens in circulation.         |

**PHP Integration



**Appendix**

**Test keys**

```
Alice 0xa5f8ff129c19dbc0849619916c16010738ab5b1f
Bob 0xbcd5e9679b654db151c62b1f5669231f2aa8dcb9
Owner 0xe2356d29d5dfecb4ee43c031204aeded24749959
```

**Scripts**

```
testrpc
--account="0x221bbb8b9b508c2841a60f862e9d03c1997097f99ee83db94e077ff180265247,500000000000000000000000"
\\

\--account="0x9790dbc40d24723c34cf942f4dafac69ceb9e52bb9c92135221596ac25ba4270,500000000000000000000000"
\\

\--account="0x68296c6629c546483664ea232e33f187f60ca4ba123692c707168f2ac330dacf,500000000000000000000000"
\\

\--account="0xb5b03722b215f55bd753814b6bce7b7ff98704b312a49b95fafa5ccfbee08ab9,500000000000000000000000"
\\

\--account="0xfd74b2d5b56010a52fa6f84fe7ed7f7b72b22cc5cd978172d83f6c27144996ae,500000000000000000000000"
\\
```

**References**

The Unix epoch (or Unix time or POSIX time or Unix timestamp) is the number of
seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not counting
leap seconds (in ISO 8601: 1970-01-01T00:00:00Z).

ERC20 definition <https://theethereum.wiki/w/index.php/ERC20_Token_Standard>
ISO 8601 <https://www.w3.org/TR/NOTE-datetime>